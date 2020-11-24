class CalcController {

    constructor(){
        this._locale = 'pt-BR'
        this._displayCalcEl = document.querySelector("#display")
        this._dateEl = document.querySelector("#data")
        this._timeEl = document.querySelector("#hora")
        this._currentDate
        this.initButtonsEvents()
        this.initialize()
    }

    initialize(){
        this.setDisplayDateTime()

        setInterval(()=>{
            this.setDisplayDateTime()
        }, 1000)        
    }
    addEventListenerAll( element, events, fn){
        events.split( ' ' ).forEach(event => {
            element.addEventListener(event, fn, false)
        })
    }

    initButtonsEvents(){
        let buttons = document.querySelectorAll("#buttons > g, #parts > g")
        
        buttons.forEach((button, index)=>{
            
            this.addEventListenerAll(button, "click drag", e => {
                console.log(button.className.baseVal.replace("btn-", ""))
                
            })

            this.addEventListenerAll(button, "mouseup mouseover mousedown", e => {
                button.style.cursor = "pointer";
            })
        })

    }

    setDisplayDateTime(){
        this.displayDate = this.currentDate.toLocaleDateString(this._locale, {
            day: "2-digit",
            month:"long",
            year: "numeric"
        })
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale)
        // this.displayCalc = this.currentDate.toLocaleTimeString(this._locale)

    }

    get displayTime(){
        return this._timeEl.innerHTML
    }

    set displayTime(value){
        return this._timeEl.innerHTML = value
    }

    get displayDate(){
        return this._dateEl.innerHTML
    }

    set displayDate(value){
        return this._dateEl.innerHTML = value
    }

    get displayCalc () {
        return this._displayCalcEl.innerHTML
    }

    set displayCalc(value){
        this._dateEl.innerHTML = value
    }


    get currentDate () {
        return new Date()
    }
    
    set currentDate (value) {
        this._currentDate = value 
    }

    set displayCalc (value) {
        this._displayCalcEl.innerHTML = value 
    }
}