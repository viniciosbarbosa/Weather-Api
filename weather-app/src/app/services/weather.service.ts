import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiKey =  '08714796809cda203bf579752eb79030'

  constructor(private http:HttpClient) { }

  getWeatherDatas(cityName:string): Observable<any>{
    return this.http.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&mode=json&appid=${this.apiKey}`,{})
  }

  getCityFromCoordinates(latitude: number, longitude: number): Observable<any> {
    return this.http.get(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
  }

}
