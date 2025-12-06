import { Routes } from '@angular/router';
import { HomeComponent } from '../components/home/home.component';
import { PredictionComponent } from '../components/prediction/prediction.component';
import { ChatComponent } from '../components/chat/chat.component';
import { LoginComponent } from '../components/login/login.component';
import { RegisterComponent } from '../components/register/register.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'prediction', component: PredictionComponent },
  { path: 'chat', component: ChatComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', redirectTo: '' }
];
