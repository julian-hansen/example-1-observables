import {Component, OnDestroy, OnInit} from '@angular/core';
import { interval, Observable, of, Subject, Subscription } from 'rxjs';
import { ClientService } from './services/client.service';
import { concatMap, delay, map, mergeMap, take} from 'rxjs/operators'
import { Client } from './class/Client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy{
  public destroy$: Subject<boolean> = new Subject()
  public client$: Observable<Client> = of(new Client())
  public subClient$: Observable<Client> = of(new Client())
  public subscribedClient : Client | null = new Client()
  public name: string = ''
  public email = ''
  
  public showMe = false
  public sub: Subscription | null = null
  
  constructor(private svc: ClientService) {}

  ngOnInit(): void {
    this.client$ = this.svc.getClientSelector()
    this.subClient$ = this.svc.getSubjectClientSelector()
    //this.sub = this.svc.getClientSelector().subscribe(client => console.log({client}))
    
    this.sub = this.svc.getClientSelector()
    .subscribe((client:Client) => this.subscribedClient = client)

    const source = of(2000, 1000);
    // map value from source into inner observable, when complete emit result and move to next
    const example = source.pipe(
      concatMap(val => of(`Delayed by: ${val}ms`).pipe(delay(val)))
    );
    //output: With concatMap: Delayed by: 2000ms, With concatMap: Delayed by: 1000ms
    const subscribe = example.subscribe(val =>
      console.log(`With concatMap: ${val}`)
    );
    

    // showing the difference between concatMap and mergeMap
    const mergeMapExample = source
      .pipe(
        // just so we can log this after the first example has run
        delay(5000),
        mergeMap(val => of(`Delayed by: ${val}ms`).pipe(delay(val)))
      )
      .subscribe(val => console.log(`With mergeMap: ${val}`));    

    const test:Observable<any> = of([1,2,3], "dog", 25)
    const timer = interval(1000).pipe(take(2))
    test
    .pipe(
      concatMap((a:any) => timer
        .pipe(
          map((i:number) => i + ' => ' + a)
          )
      )
    ).subscribe(res => console.log('---------------->', res))

    test
    .pipe(
      mergeMap(a => timer
        .pipe(
          map(i => i + ' => ' + a)
          )
      )
      ).subscribe(res => console.log('=================>', res))
    

/*    
    test
    .pipe(
      take(2),
      mergeMap(a => interval(1000).pipe(
        take(5),
        map(i => i.toString() + ' => ' + a)
      ))
    )
    .subscribe(a => console.log(a))
*/
  }

  killSub() {
    if (this.sub){
      this.sub.unsubscribe()
      this.subscribedClient = null
    }
  }
  ngOnDestroy(): void {
    this.destroy$.next(true)
    this.destroy$.complete()
  }

  updateClient() {
    this.svc.setClient({name: this.name, email: this.email})
  }
}
