// Catálogo local: es | en (para el modelo CLIP) | científico | tipo de cuidados | tóxica para mascotas/niños (1/0)
const RAW=`Monstera|monstera|Monstera deliciosa|tropical|1
Potos|pothos|Epipremnum aureum|tropical|1
Lengua de suegra|snake plant|Dracaena trifasciata|suculenta|1
Aloe vera|aloe vera|Aloe vera|suculenta|1
Ficus lira|fiddle leaf fig|Ficus lyrata|tropical|1
Árbol del caucho|rubber plant|Ficus elastica|tropical|1
Cinta|spider plant|Chlorophytum comosum|tropical|0
Cuna de Moisés|peace lily|Spathiphyllum wallisii|tropical|1
Zamioculca|ZZ plant|Zamioculcas zamiifolia|tropical|1
Palma areca|areca palm|Dypsis lutescens|palma|0
Palma kentia|kentia palm|Howea forsteriana|palma|0
Palma de salón|parlor palm|Chamaedorea elegans|palma|0
Helecho de Boston|boston fern|Nephrolepis exaltata|helecho|0
Orquídea mariposa|phalaenopsis orchid|Phalaenopsis spp.|flor|0
Cactus|cactus|Cactaceae|suculenta|0
Echeveria|echeveria|Echeveria elegans|suculenta|0
Árbol de jade|jade plant|Crassula ovata|suculenta|1
Rosa|rose|Rosa spp.|flor|0
Lavanda|lavender|Lavandula angustifolia|aromatica|1
Albahaca|basil|Ocimum basilicum|aromatica|0
Romero|rosemary|Salvia rosmarinus|aromatica|0
Geranio|geranium|Pelargonium spp.|flor|1
Begonia|begonia|Begonia spp.|flor|1
Filodendro|philodendron|Philodendron spp.|tropical|1
Dieffenbachia|dieffenbachia|Dieffenbachia seguine|tropical|1
Calathea|calathea|Calathea spp.|tropical|0
Hiedra|ivy|Hedera helix|tropical|1
Girasol|sunflower|Helianthus annuus|flor|0
Kalanchoe|kalanchoe|Kalanchoe blossfeldiana|suculenta|1
Aglaonema|chinese evergreen|Aglaonema commutatum|tropical|1
Dracena|dracaena|Dracaena fragrans|tropical|1
Peperomia|peperomia|Peperomia obtusifolia|tropical|0
Hortensia|hydrangea|Hydrangea macrophylla|flor|1
Bromelia|bromeliad|Bromeliaceae|tropical|0
Ave del paraíso|bird of paradise|Strelitzia reginae|tropical|1`;
export const PLANTS=RAW.split('\n').map(l=>{const[es,en,sci,tipo,t]=l.split('|');return{es,en,sci,tipo,tox:t==='1'}});
export const CARE={
tropical:{riego:'Cuando los 2–3 cm superiores de tierra estén secos; evita encharcar.',luz:'Luz brillante indirecta; evita el sol directo fuerte.',sustrato:'Mezcla aireada con perlita y fibra de coco, con buen drenaje.',temperatura:'18–27 °C; protégela de corrientes frías.',fertilizacion:'Fertilizante líquido diluido cada 3–4 semanas en primavera y verano.'},
suculenta:{riego:'Poco: solo cuando el sustrato esté completamente seco.',luz:'Mucha luz, con algo de sol directo suave.',sustrato:'Sustrato para cactus y suculentas, muy drenante.',temperatura:'15–30 °C; evita las heladas.',fertilizacion:'Abono para cactus 2–3 veces en la temporada cálida.'},
helecho:{riego:'Mantén el sustrato ligeramente húmedo, sin encharcar.',luz:'Luz indirecta o media sombra.',sustrato:'Rico en materia orgánica, húmedo pero drenante.',temperatura:'16–24 °C con buena humedad ambiental.',fertilizacion:'Fertilizante suave y diluido una vez al mes en temporada cálida.'},
palma:{riego:'Cuando la parte superior del sustrato se seque; riegos moderados.',luz:'Luz brillante indirecta.',sustrato:'Sustrato aireado y drenante.',temperatura:'18–28 °C.',fertilizacion:'Abono para palmas una vez al mes en primavera y verano.'},
flor:{riego:'Riego regular sin encharcar; algo más en floración.',luz:'Mucha luz, con varias horas de sol suave.',sustrato:'Tierra fértil y bien drenada.',temperatura:'15–25 °C según la especie.',fertilizacion:'Abono para floración cada 2 semanas en temporada.'},
aromatica:{riego:'Deja secar un poco la tierra entre riegos.',luz:'Pleno sol, 6 horas o más.',sustrato:'Suelto, drenante y poco compactado.',temperatura:'15–28 °C.',fertilizacion:'Poco: compost ligero cada 1–2 meses.'}};
export const HEALTH=[
['a photo of a healthy plant with vibrant green leaves','sana','',''],
['a photo of a plant with yellow leaves','atencion','Hojas amarillas: posible exceso de riego o falta de nutrientes.','Revisa que la maceta drene bien, espacia los riegos y retira las hojas muy amarillas.'],
['a photo of a wilted drooping plant','atencion','Se ve decaída: posible falta de agua o raíces afectadas.','Comprueba la humedad de la tierra; si está seca, riega a fondo, y si está empapada, deja secar.'],
['a photo of a plant leaf with brown spots','enferma','Manchas marrones: posible hongo o bacteria.','Aísla la planta, retira las hojas afectadas, evita mojar el follaje y valora un fungicida suave.'],
['a photo of a plant leaf with insects or pests','enferma','Posible plaga de insectos.','Aísla la planta, limpia las hojas con un paño húmedo y aplica jabón potásico o aceite de neem.'],
['a photo of a plant with dry brown crispy leaf tips','atencion','Puntas secas: aire seco, sol excesivo o riego irregular.','Aleja la planta del sol fuerte, aumenta la humedad ambiental y mantén un riego constante.']];
