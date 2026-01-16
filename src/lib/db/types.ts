
export interface Train {
    number: string;
    name: string;
    type: 'Vande Bharat' | 'Rajdhani' | 'Shatabdi' | 'Duronto' | 'Superfast' | 'Express' | 'Mail' | 'Passenger' | 'Jan Shatabdi' | 'Garib Rath' | 'Humsafar' | 'Tejas' | 'MEMU' | 'Local';
    source: string;
    sourceCode: string;
    destination: string;
    destinationCode: string;
    departureTime: string;
    arrivalTime: string;
    duration: string;
    distance: string;
    runningDays: string[];
    zone: string;
    classes: string[];
    stops: number;
    majorStops: string[];
    frequency: 'Daily' | 'Weekly' | 'Bi-Weekly' | 'Special';
}

export interface Station {
    code: string;
    name: string;
    fullName: string;
    zone: string;
    state: string;
    category: 'A1' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
    platforms: number;
    connectivity: string[];
}
