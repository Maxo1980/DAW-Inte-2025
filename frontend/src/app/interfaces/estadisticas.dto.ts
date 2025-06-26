export interface ChartDataDTO {
    labels: string[];
    datasets: {
        data: number[];
        backgroundColor?: string[];
    }[];
}

export interface EstadisticaDTO {
    pregunta: string;
    chartData: ChartDataDTO;
    chartType: string;
}

export interface ResumenAbiertasDTO {
    pregunta: string;
    resumen: string;
    palabrasClave: string[];
}