export interface Task {
  id: string;
  truePrediction: string;
  values: {
    [key: string]: string | number;
  }
}