import { Province } from "../models/province.Model";

export const getProvinces = () => {
  const provinces:Province[] = [
    // Andalucía (id 1)
    { 'id': 1, 'code': '04', 'name': 'Almería', 'autonomous_community_id': 1},
    { 'id': 2, 'code': '1', 'name': 'Cádiz', 'autonomous_community_id': 11},
    { 'id': 3, 'code': '14', 'name': 'Córdoba', 'autonomous_community_id': 1},
    { 'id': 4, 'code': '18', 'name': 'Granada', 'autonomous_community_id': 1},
    { 'id': 5, 'code': '2', 'name': 'Huelva', 'autonomous_community_id': 11},
    { 'id': 6, 'code': '23', 'name': 'Jaén', 'autonomous_community_id': 1},
    { 'id': 7, 'code': '29', 'name': 'Málaga', 'autonomous_community_id': 1},
    { 'id': 8, 'code': '4', 'name': 'Sevilla', 'autonomous_community_id': 11},

    // Aragón (id 2)
    { 'id': 9, 'code': '22', 'name': 'Huesca', 'autonomous_community_id': 2},
    { 'id': 10, 'code': '44', 'name': 'Teruel', 'autonomous_community_id': 2},
    { 'id': 11, 'code': '50', 'name': 'Zaragoza', 'autonomous_community_id': 2},

    // Asturias (id 3)
    { 'id': 12, 'code': '33', 'name': 'Asturias', 'autonomous_community_id': 3},

    // Baleares (id 4)
    { 'id': 13, 'code': '07', 'name': 'Balears, Illes', 'autonomous_community_id': 4},

    // Canarias (id 5)
    { 'id': 14, 'code': '35', 'name': 'Las Palmas', 'autonomous_community_id': 5},
    { 'id': 15, 'code': '38', 'name': 'Santa Cruz de Tenerife', 'autonomous_community_id': 5},

    // Cantabria (id 6)
    { 'id': 16, 'code': '39', 'name': 'Cantabria', 'autonomous_community_id': 6},

    // Castilla y León (id 7)
    { 'id': 17, 'code': '05', 'name': 'Ávila', 'autonomous_community_id': 7},
    { 'id': 18, 'code': '09', 'name': 'Burgos', 'autonomous_community_id': 7},
    { 'id': 19, 'code': '24', 'name': 'León', 'autonomous_community_id': 7},
    { 'id': 20, 'code': '34', 'name': 'Palencia', 'autonomous_community_id': 7},
    { 'id': 21, 'code': '37', 'name': 'Salamanca', 'autonomous_community_id': 7},
    { 'id': 22, 'code': '40', 'name': 'Segovia', 'autonomous_community_id': 7},
    { 'id': 23, 'code': '42', 'name': 'Soria', 'autonomous_community_id': 7},
    { 'id': 24, 'code': '47', 'name': 'Valladolid', 'autonomous_community_id': 7},
    { 'id': 25, 'code': '49', 'name': 'Zamora', 'autonomous_community_id': 7},

    // Castilla-La Mancha (id 8)
    { 'id': 26, 'code': '02', 'name': 'Albacete', 'autonomous_community_id': 8},
    { 'id': 27, 'code': '13', 'name': 'Ciudad Real', 'autonomous_community_id': 8},
    { 'id': 28, 'code': '16', 'name': 'Cuenca', 'autonomous_community_id': 8},
    { 'id': 29, 'code': '19', 'name': 'Guadalajara', 'autonomous_community_id': 8},
    { 'id': 30, 'code': '45', 'name': 'Toledo', 'autonomous_community_id': 8},

    // Catalunya (id 9)
    { 'id': 31, 'code': '08', 'name': 'Barcelona', 'autonomous_community_id': 9},
    { 'id': 32, 'code': '17', 'name': 'Girona', 'autonomous_community_id': 9},
    { 'id': 33, 'code': '25', 'name': 'Lleida', 'autonomous_community_id': 9},
    { 'id': 34, 'code': '43', 'name': 'Tarragona', 'autonomous_community_id': 9},

    // Comunitat Valenciana (id 10)
    { 'id': 35, 'code': '03', 'name': 'Alacant/Alicante', 'autonomous_community_id': 10},
    { 'id': 36, 'code': '12', 'name': 'Castelló/Castellón', 'autonomous_community_id': 10},
    { 'id': 37, 'code': '46', 'name': 'Valencia/València', 'autonomous_community_id': 10},

    // Extremadura (id 11)
    { 'id': 38, 'code': '06', 'name': 'Badajoz', 'autonomous_community_id': 11},
    { 'id': 39, 'code': '10', 'name': 'Cáceres', 'autonomous_community_id': 11},

    // Galicia (id 12)
    { 'id': 40, 'code': '15', 'name': 'Coruña, A', 'autonomous_community_id': 12},
    { 'id': 41, 'code': '27', 'name': 'Lugo', 'autonomous_community_id': 12},
    { 'id': 42, 'code': '32', 'name': 'Ourense', 'autonomous_community_id': 12},
    { 'id': 43, 'code': '36', 'name': 'Pontevedra', 'autonomous_community_id': 12},

    // Madrid (id 13)
    { 'id': 44, 'code': '28', 'name': 'Madrid', 'autonomous_community_id': 13},

    // Murcia (id 14)
    { 'id': 45, 'code': '30', 'name': 'Murcia', 'autonomous_community_id': 14},

    // Navarra (id 15)
    { 'id': 46, 'code': '3', 'name': 'Navarra', 'autonomous_community_id': 15},

    // País Vasco (id 16)
    { 'id': 47, 'code': '0', 'name': 'Araba/Álava', 'autonomous_community_id': 16},
    { 'id': 48, 'code': '48', 'name': 'Bizkaia', 'autonomous_community_id': 16},
    { 'id': 49, 'code': '20', 'name': 'Gipuzkoa', 'autonomous_community_id': 16},

    // La Rioja (id 17)
    { 'id': 50, 'code': '26', 'name': 'Rioja, La', 'autonomous_community_id': 17},

    // Ceuta (id 18)
    { 'id': 51, 'code': '5', 'name': 'Ceuta', 'autonomous_community_id': 18},

    // Melilla (id 19)
    { 'id': 52, 'code': '52', 'name': 'Melilla', 'autonomous_community_id': 19}
  ];

  return provinces;
}