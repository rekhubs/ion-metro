import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FolderPageRoutingModule } from './folder-routing.module';

import { FolderPage } from './folder.page';
import { HomeComponent } from './home/home.component';
import { HomeWebComponent } from './home-web/home-web.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { SettingsComponent } from './settings/settings.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FolderPageRoutingModule
  ],
  declarations: [
    FolderPage,
    HomeComponent,
    HomeWebComponent,
    FavoritesComponent,
    SettingsComponent
  ],
  exports: [
  ]
})
export class FolderPageModule {}
