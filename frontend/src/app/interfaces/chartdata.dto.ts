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