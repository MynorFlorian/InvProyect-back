import momentZone from 'moment-timezone';
export class Utils {
    static instance = new Utils()

    minutosTranscurridos = (fecharec: Date): number => {
        var now = momentZone.tz('America/Guatemala');
        var bar = momentZone.tz(fecharec, 'America/Guatemala');
        return now.diff(bar, 'minutes');
    }

    horasTranscurridas = (fecharec: Date): number => {
        var now = momentZone.tz('America/Guatemala');
        var bar = momentZone.tz(fecharec, 'America/Guatemala');
        return now.diff(bar, 'hours');
    }

    codeGenerator = () => {

        let num1 = Math.floor(Math.random() * 10)
        let num2 = Math.floor(Math.random() * 10)
        let num3 = Math.floor(Math.random() * 10)
        let num4 = Math.floor(Math.random() * 10)
        let num5 = Math.floor(Math.random() * 10)
        let num6 = Math.floor(Math.random() * 10)

        let code = num1.toString() + num2.toString() + num3.toString() + num4.toString() + num5.toString() + num6.toString()
        return code
    }

    isNumber = (word: any) => {
        for (let index = 0; index < word.length; index++) {
            if (!(word.charCodeAt(index) >= 48 && word.charCodeAt(index) <= 57)) return false
        }
        return true;
    }
}