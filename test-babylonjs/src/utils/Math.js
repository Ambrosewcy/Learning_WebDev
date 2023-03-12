
export class Math_Utilities{
    constructor(){}

    static radians_to_degrees(radians) {
        return radians * (180/Math.PI);
    }

    static degrees_to_radians(degrees){
        return degrees * Math.PI / 180;
    }
}