
class Dataset {
    constructor() {
        this.data = []
    }
    has(element) {
        return (!this.data.indexOf(element) === -1)
    }
    getValues() {
        return this.data
    }
    addData(element) {
        if(!this.has(element)) {
            this.data.push(element)
            return true
        }
        return false
    }
    getSize() {
        return this.data.length
    } 
    removeData(element) {
        if(!this.has(element)) {
            index = this.data.indexOf(element)
            this.data.splice(index, 1)
            return true
        }
        return false
    }
}

class Charts {
    constructor() {
        this.data = []
    }
    drawPie(setExpences) {
        const Dset = new Dataset()
        
    }
}       