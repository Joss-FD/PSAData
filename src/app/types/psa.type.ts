export interface PSADetailsResponse {
    PSACert: PSACert;
}

export interface PSACert {
    CertNumber: string;
    SpecID: number;
    SpecNumber: string;
    LabelType: string;
    ReverseBarCode: boolean;
    Year: string;
    Brand: string;
    Category: string;
    CardNumber: string;
    Subject: string;
    Variety: string;
    IsPSADNA: boolean;
    IsDualCert: boolean;
    GradeDescription: string;
    CardGrade: string;
    TotalPopulation: number;
    TotalPopulationWithQualifier: number;
    PopulationHigher: number;
}


export interface PSAImages {
    IsFrontImage: boolean;
    ImageURL: string
}