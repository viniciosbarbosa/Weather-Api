import { Subject, takeUntil } from 'rxjs';
import { WeatherService } from './../../services/weather.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { WeatherDatas } from 'src/app/interfaces/WeatherDatas';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit , OnDestroy{
  private readonly destroy$:Subject<void> = new Subject()
  initialCityName : any
  weatherDatas!:WeatherDatas
  searchIcon = faMagnifyingGlass


  constructor(private weatherService:WeatherService){

  }

  ngOnInit(): void {
    this.getUserLocation()
  }

   getUserLocation(){
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
            console.log(position.coords.latitude, position.coords.longitude);

            this.getCityFromCoordinates(position.coords.latitude, position.coords.longitude);
      }, (error) => {
        console.log('Erro ao buscar localização do usuario :', error);
        this.initialCityName = "New York"
        this.getWeatherDatas(this.initialCityName)
      });
    } else {
      console.log('Geolocalização não é suportada por esse navegador.');
    }
  }

   getCityFromCoordinates(latitude: number, longitude: number) {
    this.weatherService.getCityFromCoordinates(latitude, longitude)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          console.log(data.address, data.address.town);
          if (data.address && data.address.town) {
            this.initialCityName = data.address.town;
            console.log(this.initialCityName)
            this.getWeatherDatas(this.initialCityName)
          } else {
            console.log('Dados da cidade faltando ou invalidos', data);
          }
        },
        error: (error) => {
          console.log('Erro ao buscar cordenadas', error);
        }
      });
  }


  getWeatherDatas(cityName:string): void{
    this.weatherService.getWeatherDatas(cityName)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next:(response) =>{
        response && (this.weatherDatas = response)
        console.log(this.weatherDatas)
      },
      error:(error) =>console.log(error),
    })
  }

  onSubmit():void{
    this.getWeatherDatas(this.initialCityName)
    this.initialCityName = ""
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }


}
