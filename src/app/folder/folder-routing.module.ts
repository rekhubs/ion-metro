import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FolderPage } from './folder.page';
import { HomeComponent } from './home/home.component';
import { HomeWebComponent } from './home-web/home-web.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { SettingsComponent } from './settings/settings.component';

const routes: Routes = [
  // {
  //   path: ':id',
  //   component: FolderPage
  // },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'home-web',
    component: HomeWebComponent
  },
  {
    path: 'info',
    component: FolderPage
  },
  {
    path: 'favorites',
    component: FavoritesComponent
  },
  {
    path: 'settings',
    component: SettingsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FolderPageRoutingModule {}
