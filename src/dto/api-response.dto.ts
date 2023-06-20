export class ApiResponseDto {
  data?: any;
  error?: {
    message: string;
    error?: any;
  };
  message: string;
}
