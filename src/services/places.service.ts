import {Place} from "../models/place.model";
import {Location} from "../models/location.model";
import {Storage} from "@ionic/storage";
import {Injectable} from "@angular/core";
import {File} from "ionic-native";

declare var cordova: any;

@Injectable()
export class PlacesService {
  private places: Place[] = [];

  constructor(private storage: Storage){}

  addPlace(title: string, description: string, location:Location, imageUrl: string){
    const place = new Place(title, description, location, imageUrl);
    this.places.push(place);
    this.storage.set('places', this.places)
      .then()
      .catch(
        err => {
          this.places.splice(this.places.indexOf(place),1);
        }
      );
  }

  loadPlaces(){
    return this.places.slice();
  }

  deletePlace(index: number){
    const place = this.places[index];
    this.places.splice(index,1);
    this.storage.set('places',this.places)
      .then(
        ()=> {
          this.removeFile(place);
        }
      )
      .catch(
        err => console.log(err)
      );
  }

  fetchPlaces(){
    return this.storage.get('places')
      .then(
        (places: Place[]) =>{
          return this.places = places != null ? places : [];
        }
      )
      .catch(
        err => {
          console.log(err);
        }
      )
  }
  private removeFile(place:Place){
    const currentName = place.imageUrl.replace(/^.*[\\\/]/, '');
    File.removeFile(cordova.file.dataDirectory, currentName)
      .then(
        () => console.log('Removed File')
      )
      .catch(
        () => {
          console.log('Error while removing File');
          this.addPlace(place.title, place.description, place.location, place.imageUrl);
        }
      );
  }
}
