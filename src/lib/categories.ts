export type CategoryGroup = {
  title: string;
  items: string[];
};

export const EXPENSE_CATEGORY_GROUPS: CategoryGroup[] = [
  {
    title: "Vivienda",
    items: ["Alquiler", "Hipoteca", "Administracion", "Mantenimiento", "Reparaciones", "Muebles", "Seguro hogar"],
  },
  {
    title: "Servicios",
    items: ["Electricidad", "Agua", "Gas", "Internet", "Telefono", "Television", "Basura"],
  },
  {
    title: "Alimentacion",
    items: ["Supermercado", "Restaurante", "Cafe", "Delivery", "Panaderia", "Snacks"],
  },
  {
    title: "Transporte",
    items: [
      "Combustible",
      "Transporte publico",
      "Taxi",
      "Parking",
      "Peajes",
      "Mantenimiento vehiculo",
      "Seguro vehiculo",
      "Repuestos",
    ],
  },
  {
    title: "Salud",
    items: ["Seguro medico", "Medicinas", "Consultas", "Dentista", "Optica", "Terapia"],
  },
  {
    title: "Educacion",
    items: ["Cursos", "Libros", "Materiales", "Matricula"],
  },
  {
    title: "Trabajo",
    items: ["Herramientas", "Oficina", "Coworking", "Capacitacion"],
  },
  {
    title: "Familia",
    items: ["Guarderia", "Colegio", "Actividades hijos", "Pension"],
  },
  {
    title: "Mascotas",
    items: ["Comida mascotas", "Veterinario", "Accesorios mascotas"],
  },
  {
    title: "Ropa y cuidado personal",
    items: ["Ropa", "Calzado", "Lavanderia", "Peluqueria", "Cosmeticos", "Cuidado personal"],
  },
  {
    title: "Ocio",
    items: ["Entretenimiento", "Cine", "Streaming", "Videojuegos", "Deportes", "Eventos"],
  },
  {
    title: "Viajes",
    items: ["Vuelos", "Alojamiento", "Transporte viaje", "Comidas viaje", "Tours"],
  },
  {
    title: "Finanzas",
    items: ["Comisiones bancarias", "Intereses", "Tarjeta credito", "Prestamos", "Impuestos", "Multas"],
  },
  {
    title: "Suscripciones",
    items: ["Gimnasio", "Software", "Apps", "Musica"],
  },
  {
    title: "Regalos y donaciones",
    items: ["Regalos", "Donaciones", "Celebraciones"],
  },
  {
    title: "Otros",
    items: ["Hogar", "Limpieza", "Otros"],
  },
];

export const EXPENSE_CATEGORIES = EXPENSE_CATEGORY_GROUPS.flatMap((group) => group.items);
