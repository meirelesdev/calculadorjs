class CalcController {

    constructor(){

        this._audio = new Audio('click.mp3')
        this._audioOnOff = false

        this._lastOperator = ''
        this._lastNumber = ''

        this._operation = []
        this._locale = 'pt-BR'
        this._displayCalcEl = document.querySelector("#display")
        this._dateEl = document.querySelector("#data")
        this._timeEl = document.querySelector("#hora")
        this._currentDate
        this.initialize()
        this.initButtonsEvents()
        this.initKeyBoard()
    }

    pasteFromClipboard(){
        
        document.addEventListener('paste', (e) => {
            
            let value = e.clipboardData.getData('Text')
            
            value = parseFloat(value)
            if(value){

                this.addOperation(value)
            } else {
                this.displayCalc = value
            }
        })



    }

    copyToClipboard(){

        let input = document.createElement('input')

        input.value = this.displayCalc;

        document.body.appendChild(input)

        input.select()

        document.execCommand("Copy")

        input.remove()

    }

    initialize(){
        this.setDisplayDateTime()

        setInterval(()=>{
            this.setDisplayDateTime()
        }, 1000)        

        this.setLastNumberToDisplay()
        this.pasteFromClipboard()

        document.querySelectorAll(".btn-ac").forEach(btn =>{
            
            btn.addEventListener("dblclick", (e) => {
                
                this.toggleAudio();

            })
        })
    }

    toggleAudio(){
        this._audioOnOff = !this._audioOnOff
    }

    playAudio(){
        if(this._audioOnOff){
            this._audio.currentTime = 0
            this._audio.play();
        }
    }

    initKeyBoard(){
        document.addEventListener('keyup', (e)=>{

           
            switch (e.key){
                case 'Escape':

                    this.playAudio()
                    this.clearAll()
                    break
                case 'Backspace':

                    this.playAudio()
                    this.clearEntry()
                    break
                case '/':
                case '%':
                case '*':
                case '-':
                case '+':

                    this.playAudio()
                    this.addOperation(e.key)
                    break
                case 'Enter':
                case '=':

                    this.playAudio()
                    this.calc()
                    break
                case ',':
                case '.':
                    this.addDot()
                    this.playAudio()

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
                    this.playAudio()
                    this.addOperation(parseInt(parseInt(e.key)))
                    break
                case 'c':
                case 'C':

                    this.playAudio()
                    if (e.ctrlKey) this.copyToClipboard()        
                    break
            }
        })
    }
    addEventListenerAll( element, events, fn){
        events.split( ' ' ).forEach(event => {
            element.addEventListener(event, fn, false)
        })
    }

    clearAll(){
        this._operation = []
        this.setLastNumberToDisplay(true)
    }
    
    clearEntry(){
        this._operation.pop()
        this.setLastNumberToDisplay(true)
        
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
        }
    }

    getResult(){


        return eval(this._operation.join(""))

    }

    calc(){
        
        let last = ''   
        let calc 
        this._lastOperator = this.getLastItem()
        
        if ( this.getOperationLength() < 3 ){
            
            let firstItem = this._operation[0]

            this._operation = [firstItem, this._lastOperator, this._lastNumber]
        }
        
        if ( this.getOperationLength() > 3 ) {
            
            last = this._operation.pop()
            
            this._lastNumber = this.getResult()
            
        } else if(this.getOperationLength() == 3){
            
            this._lastNumber = this.getLastItem(false)
            
        }
        calc = this.getResult()
        
        if(last == "%"){
            
            calc /= 100
            
            this._operation = [ calc ]
            
        } else {
            
            this._operation = [ calc ]
            
            if ( last ) this._operation.push( last )
            
        }
        
        
        this.setLastNumberToDisplay()
    }

    getOperationLength(){
        return this._operation.length
    }

    getLastItem(isOperator = true){

        let lastItem

        for(let pos = this.getOperationLength() -1; pos >= 0; pos--){

        
            if(this.isOperator(this._operation[pos]) == isOperator ){
                this.displayCalc = this._operation[pos]
                lastItem = this._operation[pos]
                break
            }

        }

        if(!lastItem){
            lastItem = (isOperator) ? this._lastOperator : this._lastNumber
        }

        return lastItem
    }

    setLastNumberToDisplay(clear = false){
        if(!clear){
            let lastNumber = this.getLastItem(false)
            this.displayCalc = lastNumber ? lastNumber : 0

            if(this._operation.length == 1){
                this.displayCalc = this._operation
            }
        } else {
            this._lastNumber = 0
            this._lastOperator = ''
            this.displayCalc = 0
        }

    }

    addOperation(value){
    
        if( isNaN( this.getLastOperation() ) ) {
            
            if ( this.isOperator(value) ){
                
                this.setLastOperation(value)
            }  else {
                this.pushOperation(value)
                this.setLastNumberToDisplay()

            }
            
        } else {

            if ( this.isOperator(value) ){

                this.pushOperation(value)

            } else {
                let newValue = this.getLastOperation().toString() + value.toString()
                this.setLastOperation(newValue)

                //Atualizar display
                this.setLastNumberToDisplay()
            }
        }
    }

    setError(){
        this.displayCalc = "Error"
    }

    addDot(){
        let lastOperation = this.getLastOperation()

        
        if ( typeof lastOperation === 'string' && (lastOperation.split('').indexOf('.') > -1) ){
            
            return

        }
        if( this.isOperator(lastOperation) || !lastOperation ){
            this.pushOperation('0.')
        } else {
            this.setLastOperation(lastOperation.toString() + '.')
        }
        this.setLastNumberToDisplay()
        
    }

    execBtn(value){
        
        this.playAudio()

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
                this.addDot()
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
        
        if(value.toString().length > 10 ){
            this.setError()
            return
        }
        this._displayCalcEl.innerHTML = value
    }


    get currentDate () {
        return new Date()
    }
    
    set currentDate (value) {
        this._currentDate = value 
    }

}