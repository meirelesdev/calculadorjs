class CalcController {

    constructor(){

        this._operation = []
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

    clearAll(){
        this._operation = []
        this.setLastNumberToDisplay()
    }

    clearEntry(){
        this._operation.pop()
        
    }
    
    getLastOperation(){
        return this._operation[this.getOperationLength() - 1]
    }
    
    isOperator(value){
        return ( ['+', '-', '*', '%', '/'].indexOf(value)  > -1 )
    }
    
    setLastOperation(value){
        if(this.getOperationLength() > 0){
            this._operation[this.getOperationLength() - 1] = value
        }
    }

    pushOperation(value){
        this._operation.push(value)
        if( this.getOperationLength() > 3){
            
            this.calc()
            console.log(this._operation)
        }
    }

    calc(){
        let calc
        let last
        if(this.getOperationLength() > 3) {
            last = this._operation.pop()
            if(last == "%"){

            } else {
                calc = eval(this._operation.join(""))
                this._operation = [ calc , last ]
                this.setLastNumberToDisplay()
            }
        } else {
            calc = eval(this._operation.join(""))
            this._operation = [ calc ]
            this.setLastNumberToDisplay()

        }
    }

    getOperationLength(){
        return this._operation.length
    }
    
    setLastNumberToDisplay(){
        let lastNumber

        for(let i = this.getOperationLength() -1; i >= 0; i--){
            if(!this.isOperator(this._operation[i])){
               this.displayCalc = this._operation[i]
               lastNumber = this._operation[i]
               break
            }
        }
        this.displayCalc = lastNumber ? lastNumber : 0
    }

    addOperation(value){
    
        if( isNaN(this.getLastOperation()) ) {
            
            if (this.isOperator(value) ){

                this.setLastOperation(value)
                
            } else {
                this.pushOperation(value)
                this.setLastNumberToDisplay()
                
            }
            
        } else {

            if ( this.isOperator(value) ){

                this.pushOperation(value)

            } else {
                let newValue = this.getLastOperation().toString() + value.toString()
                this.setLastOperation(parseInt(newValue))

                //Atualizar display
                this.setLastNumberToDisplay()
            }
        }
        console.log("ta assim: ", this._operation)       
    }

    setError(){
        this.displayCalc = "Error"
    }

    execBtn(value){

        switch (value){
            case 'ac':
                this.clearAll()
                break
            case 'ce':
                this.clearEntry()
                break
            case 'divisao':
                this.addOperation('/')
                break
            case 'porcento':
                this.addOperation('%')
                break
            case 'multiplicacao':
                this.addOperation('*')
                break
            case 'subtracao':
                this.addOperation('-')
                break
            case 'soma':
                this.addOperation('+')
                break
            case 'igual':

                this.calc()
                break
            case 'ponto':
                this.addOperation('.')
                break
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':

                this.addOperation(parseInt(value))
                break
            default:
                this.setError()
                break
        }
    }

    initButtonsEvents(){
        let buttons = document.querySelectorAll("#buttons > g, #parts > g")
        
        buttons.forEach((button, index)=>{
            
            this.addEventListenerAll(button, "click drag", e => {
                let btnValue = button.className.baseVal.replace("btn-", "")
                // console.log(btnValue)
                this.execBtn(btnValue)
                
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