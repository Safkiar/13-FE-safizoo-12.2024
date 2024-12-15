import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent implements OnInit {
  constructor(private router: Router) {}
  ngOnInit(): void {}

  doSearch(value: string) {
    this.router.navigateByUrl(`/search/${value}`);
  }
}
