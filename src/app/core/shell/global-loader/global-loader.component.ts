import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalLoaderService } from '../../services/global-loader.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-global-loader',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './global-loader.component.html',
  styleUrl: './global-loader.component.scss'
})
export class GlobalLoaderComponent {
  isLoading$: Observable<boolean> = this.globalLoaderService.isLoading$();

  constructor(private globalLoaderService: GlobalLoaderService) {}

}
