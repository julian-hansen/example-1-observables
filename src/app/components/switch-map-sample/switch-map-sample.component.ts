import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, of, Subject } from 'rxjs';
import { debounceTime, filter, switchMap, takeUntil } from 'rxjs/operators';

const data = [
  {color: 'Blue', msg: 'You selected blue as your favourite colour'},
  {color: 'Red' , msg: 'Do you really like red that much'},
  {color: 'Green', msg: 'The colour of trees, nice!'},
  {color: 'White', msg : 'White are you talking about?'}
]

const lookahead = [
  "apple",
  "appelation",
  "appleton",
  "ape",
  "appeal",
  "banana",
  "banal",
  "basic"
]

const getMessage = (colour:string) : Observable<string | null> => {
  const result = data.find(item => item.color == colour)

  if (result) {
    return of(result.msg)
  }

  return of(null)
}

const getTypeAhaed = (lookup: string) : Observable<string[]> => {
  const lcase = lookup.toLowerCase()
  return of(lookahead.filter(val => val.toLowerCase().includes(lcase)))
}

@Component({
  selector: 'app-switch-map-sample',
  templateUrl: './switch-map-sample.component.html',
  styleUrls: ['./switch-map-sample.component.scss']
})
export class SwitchMapSampleComponent implements OnInit, OnDestroy {
  public destroy$: Subject<boolean> = new Subject()
  public message$: Observable<string | null> = of(null)
  public otherMessage: string | null = ''
  public lookahead$ : Observable<string[]> = of([])
  public options = ["Red", "Blue", "Green", "White"];

  public fg = new FormGroup({
    options: new FormControl(''),
    firstname: new FormControl('Default Value')
  });

  constructor() { }

  get optionsCtrl() : FormControl {
    return this.fg.get('options') as FormControl
  }

  get namectrl() : FormControl {
    return this.fg.get('firstname') as FormControl
  }

  ngOnInit(): void {
    this.namectrl.patchValue('Matthew')

    this.lookahead$ = this.namectrl.valueChanges
    .pipe(
      takeUntil(this.destroy$),
      filter(val => val.length > 3),
      debounceTime(400),
      switchMap(val => getTypeAhaed(val))
    )

    /*the non-switchmap way */
    this.optionsCtrl.valueChanges
    .pipe (
      takeUntil(this.destroy$)
    ).subscribe(val => {
      getMessage(val)
        .pipe(
          takeUntil(this.destroy$)
        )
        .subscribe(val => this.otherMessage = val)
    })

    /* Using switchmap */
    this.message$ = this.optionsCtrl.valueChanges
    .pipe(
      takeUntil(this.destroy$),
      switchMap(val => getMessage(val))
    )
  }

  ngOnDestroy(): void {
    this.destroy$.next(true)
    this.destroy$.complete()
  }
}
