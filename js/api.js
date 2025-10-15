// Funções de API para cálculo de distâncias

// Geocodificar cidade usando Nominatim (OpenStreetMap)
async function geocodificarCidade(cidade) {
    try {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cidade)}&format=json&limit=1`;
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Lider-Calculadora/1.0'
            }
        });

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const data = await response.json();

        if (data.length === 0) {
            throw new Error(`Cidade não encontrada: ${cidade}`);
        }

        return {
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon)
        };
    } catch (error) {
        console.error('Erro ao geocodificar:', error);
        throw error;
    }
}

// Calcular distância usando Google Maps Distance Matrix API
async function calcularDistanciaGoogleMaps(cidadeOrigem, cidadeDestino) {
    if (!googleMapsApiKey) {
        throw new Error('API Key do Google Maps não configurada');
    }

    try {
        const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(cidadeOrigem)}&destinations=${encodeURIComponent(cidadeDestino)}&key=${googleMapsApiKey}`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.status !== 'OK') {
            throw new Error(`Google Maps API erro: ${data.status}`);
        }

        const element = data.rows[0].elements[0];

        if (element.status !== 'OK') {
            throw new Error(`Rota não encontrada: ${element.status}`);
        }

        const distanciaMetros = element.distance.value;
        const distanciaKm = Math.round(distanciaMetros / 1000);

        return {
            distancia: distanciaKm,
            metodo: 'Google Maps (Rota real)'
        };
    } catch (error) {
        console.error('Erro Google Maps:', error);
        throw error;
    }
}

// Calcular distância usando OSRM (Open Source Routing Machine)
async function calcularDistanciaOSRM(coordsOrigem, coordsDestino) {
    try {
        const url = `https://router.project-osrm.org/route/v1/driving/${coordsOrigem.lng},${coordsOrigem.lat};${coordsDestino.lng},${coordsDestino.lat}?overview=false`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.code !== 'Ok') {
            throw new Error(`OSRM erro: ${data.code}`);
        }

        const distanciaMetros = data.routes[0].distance;
        const distanciaKm = Math.round(distanciaMetros / 1000);

        return distanciaKm;
    } catch (error) {
        console.error('Erro OSRM:', error);
        throw error;
    }
}

// Calcular distância usando fórmula de Haversine (linha reta × 1.4 para aproximar estrada)
function calcularDistanciaHaversine(coords1, coords2) {
    const R = 6371; // Raio da Terra em km

    const dLat = (coords2.lat - coords1.lat) * Math.PI / 180;
    const dLng = (coords2.lng - coords1.lng) * Math.PI / 180;

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(coords1.lat * Math.PI / 180) * Math.cos(coords2.lat * Math.PI / 180) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanciaLinhaReta = R * c;

    // Multiplicar por 1.4 para aproximar distância por estradas
    const distanciaAproximada = Math.round(distanciaLinhaReta * 1.4);

    return distanciaAproximada;
}

// Função principal para calcular distância
// PRIORIDADE: OSRM (gratuito e preciso) → Haversine (fallback)
async function calcularDistanciaInteligente(cidadeOrigem, cidadeDestino) {
    let resultado = { distancia: 0, metodo: 'Desconhecido' };

    // Método 1: OSRM - Open Source Routing Machine (PADRÃO)
    // ✅ 100% GRATUITO - Rota real por estradas
    try {
        console.log('🌐 Calculando via OSRM (gratuito)...');
        const coordsOrigem = await geocodificarCidade(cidadeOrigem);
        const coordsDestino = await geocodificarCidade(cidadeDestino);
        const distancia = await calcularDistanciaOSRM(coordsOrigem, coordsDestino);
        resultado = {
            distancia: distancia,
            metodo: 'OSRM - Rota Real (Gratuito)'
        };
        console.log('✅ Sucesso OSRM:', resultado);
        return resultado;
    } catch (error) {
        console.log('⚠️ OSRM falhou:', error.message);
    }

    // Método 2: Cálculo Haversine (FALLBACK)
    // ✅ Sempre funciona - Aproximação matemática
    try {
        console.log('📐 Usando cálculo aproximado (Haversine)...');
        const coordsOrigem = await geocodificarCidade(cidadeOrigem);
        const coordsDestino = await geocodificarCidade(cidadeDestino);
        const distancia = calcularDistanciaHaversine(coordsOrigem, coordsDestino);
        resultado = {
            distancia: distancia,
            metodo: 'Haversine - Aproximado (linha reta × 1.4)'
        };
        console.log('✅ Sucesso Haversine:', resultado);
        return resultado;
    } catch (error) {
        console.log('❌ Cálculo aproximado falhou:', error.message);
    }

    throw new Error('Não foi possível calcular a distância por nenhum método');
}
