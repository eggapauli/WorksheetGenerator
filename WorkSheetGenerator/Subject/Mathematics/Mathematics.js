///<reference path="Common.ts"/>
///<reference path="Contract.ts"/>
var Mathematics;
(function (Mathematics) {
    (function (BasicArithmeticalOperator) {
        BasicArithmeticalOperator._map = [];
        BasicArithmeticalOperator._map[0] = "ADDITION";
        BasicArithmeticalOperator.ADDITION = 0;
        BasicArithmeticalOperator._map[1] = "SUBTRACTION";
        BasicArithmeticalOperator.SUBTRACTION = 1;
        BasicArithmeticalOperator._map[2] = "MULTIPLICATION";
        BasicArithmeticalOperator.MULTIPLICATION = 2;
        BasicArithmeticalOperator._map[3] = "DIVISION";
        BasicArithmeticalOperator.DIVISION = 3;
    })(Mathematics.BasicArithmeticalOperator || (Mathematics.BasicArithmeticalOperator = {}));
    var BasicArithmeticalOperator = Mathematics.BasicArithmeticalOperator;
    (function (NumberType) {
        NumberType._map = [];
        NumberType._map[0] = "NATURALNUMBERS";
        NumberType.NATURALNUMBERS = 0;
        NumberType._map[1] = "INTEGERS";
        NumberType.INTEGERS = 1;
        NumberType._map[2] = "REALNUMBERS";
        NumberType.REALNUMBERS = 2;
    })(Mathematics.NumberType || (Mathematics.NumberType = {}));
    var NumberType = Mathematics.NumberType;
    var NumberBounds = (function () {
        function NumberBounds(lower, upper) {
            this._lower = lower;
            this._upper = upper;
            this.normalize();
        }
        Object.defineProperty(NumberBounds.prototype, "lower", {
            get: function () {
                return this._lower;
            },
            set: function (value) {
                this._lower = value;
                this.normalize();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NumberBounds.prototype, "upper", {
            get: function () {
                return this._upper;
            },
            set: function (value) {
                this._upper = value;
                this.normalize();
            },
            enumerable: true,
            configurable: true
        });
        NumberBounds.prototype.normalize = function () {
            if(this._lower > this._upper) {
                var tmp = this._lower;
                this._lower = this._upper;
                this._upper = tmp;
            }
        };
        return NumberBounds;
    })();    
    var MentalArithmeticExercise = (function () {
        function MentalArithmeticExercise(leftOperand, rightOperand, operator) {
            this.leftOperand = leftOperand;
            this.rightOperand = rightOperand;
            this.operator = operator;
        }
        MentalArithmeticExercise.prototype.calculateResult = function () {
            var result;
            switch(this.operator) {
                case BasicArithmeticalOperator.ADDITION:
                    result = this.leftOperand + this.rightOperand;
                    break;
                case BasicArithmeticalOperator.SUBTRACTION:
                    result = this.leftOperand - this.rightOperand;
                    break;
                case BasicArithmeticalOperator.MULTIPLICATION:
                    result = this.leftOperand * this.rightOperand;
                    break;
                case BasicArithmeticalOperator.DIVISION:
                    result = this.leftOperand / this.rightOperand;
                    break;
                default:
                    throw new Error("Invalid operator: '" + this.operator + "'");
            }
            return result;
        };
        MentalArithmeticExercise.prototype.calculateRationalResult = function () {
            var result;
            if(this.operator == BasicArithmeticalOperator.DIVISION) {
                var gcd = this.calculateGCD(this.leftOperand, this.rightOperand);
                if(gcd != Math.min(this.leftOperand, this.rightOperand)) {
                    result = (this.leftOperand / gcd) + "/" + (this.rightOperand / gcd);
                }
            }
            if(result === undefined) {
                result = this.calculateResult().toString();
            }
            return result;
        };
        MentalArithmeticExercise.prototype.calculateGCD = function (x, y) {
            while(y != 0) {
                var z = x % y;
                x = y;
                y = z;
            }
            return x;
        };
        MentalArithmeticExercise.prototype.getOperatorString = function () {
            return Helper.operatorToString(this.operator);
        };
        return MentalArithmeticExercise;
    })();
    Mathematics.MentalArithmeticExercise = MentalArithmeticExercise;    
    var MentalArithmeticExerciseGenerator = (function () {
        function MentalArithmeticExerciseGenerator(options) {
            this.options = options;
            if(this.options.allowedOperators.length == 0) {
                this.options.allowedOperators = [
                    BasicArithmeticalOperator.ADDITION, 
                    BasicArithmeticalOperator.SUBTRACTION, 
                    BasicArithmeticalOperator.MULTIPLICATION, 
                    BasicArithmeticalOperator.DIVISION
                ];
            }
        }
        MentalArithmeticExerciseGenerator.MAX_GENERATION_ATTEMPTS = 5000;
        MentalArithmeticExerciseGenerator.prototype.generate = function () {
            var operatorIdx = Math.round(Math.random() * (this.options.allowedOperators.length - 1));
            var operator = this.options.allowedOperators[operatorIdx];
            var bounds = Helper.getBounds(this.options.difficulty, this.options.numberType, operator);
            var validate;
            if(this.options.numberType == NumberType.NATURALNUMBERS || this.options.numberType == NumberType.INTEGERS) {
                if(operator == BasicArithmeticalOperator.DIVISION) {
                    validate = function (exercise) {
                        var result = exercise.calculateResult();
                        return exercise.leftOperand % exercise.rightOperand == 0 && result > 2;
                    };
                } else {
                    validate = function (exercise) {
                        var result = exercise.calculateResult();
                        return result > 2;
                    };
                }
            } else {
                validate = function (exercise) {
                    var result = exercise.calculateResult();
                    return result < -2 || result > 2;
                };
            }
            var exercise = new MentalArithmeticExercise(0, 0, operator);
            var attempts = 0;
            console.log("Bounds: [" + bounds.lower + ", " + bounds.upper + "], Operator: " + Helper.operatorToString(operator));
            do {
                if(attempts++ >= MentalArithmeticExerciseGenerator.MAX_GENERATION_ATTEMPTS) {
                    throw new Error("Too many attempts to generate an exercise.");
                }
                exercise.leftOperand = Helper.generateRandomNumber(bounds, this.options.numberType);
                exercise.rightOperand = Helper.generateRandomNumber(bounds, this.options.numberType);
            }while(!validate(exercise));
            console.log("Attempts: " + attempts);
            return exercise;
        };
        return MentalArithmeticExerciseGenerator;
    })();
    Mathematics.MentalArithmeticExerciseGenerator = MentalArithmeticExerciseGenerator;    
    var Helper = (function () {
        function Helper() { }
        Helper.operatorToString = function operatorToString(operator) {
            switch(operator) {
                case BasicArithmeticalOperator.ADDITION:
                    return "+";
                case BasicArithmeticalOperator.SUBTRACTION:
                    return "-";
                case BasicArithmeticalOperator.MULTIPLICATION:
                    return "*";
                case BasicArithmeticalOperator.DIVISION:
                    return "/";
                default:
                    throw new Error("Invalid operator: '" + operator + "'");
            }
        };
        Helper.getBounds = function getBounds(difficulty, numberType, operator) {
            var bounds;
            switch(difficulty) {
                case ExerciseDifficulty.EASY:
                    bounds = new NumberBounds(2, 20);
                    break;
                case ExerciseDifficulty.MEDIUM:
                    bounds = new NumberBounds(20, 50);
                    break;
                case ExerciseDifficulty.HARD:
                    bounds = new NumberBounds(50, 500);
                    break;
                default:
                    throw new Error("Invalid difficulty: '" + difficulty + "'");
            }
            switch(operator) {
                case BasicArithmeticalOperator.ADDITION:
                    break;
                case BasicArithmeticalOperator.SUBTRACTION:
                    break;
                case BasicArithmeticalOperator.MULTIPLICATION:
                    bounds.upper = Math.round(3 * Math.sqrt(bounds.upper));
                    break;
                case BasicArithmeticalOperator.DIVISION:
                    bounds.lower = Math.round(Math.sqrt(bounds.lower));
                    break;
                default:
                    throw new Error("Invalid operator: '" + operator + "'");
            }
            if(numberType == NumberType.NATURALNUMBERS) {
                bounds.upper *= 2;
            }
            return bounds;
        };
        Helper.generateRandomNumber = function generateRandomNumber(bounds, numberType) {
            bounds.normalize();
            var attempts = 0;
            var num = 0;
            while(num < 1.5 && attempts++ <= 1) {
                num = Math.random() * (bounds.upper - bounds.lower) + bounds.lower;
            }
            // randomly switch sign
            if(numberType != NumberType.NATURALNUMBERS && Math.random() < 0.5) {
                num *= -1;
            }
            switch(numberType) {
                case NumberType.NATURALNUMBERS:
                case NumberType.INTEGERS:
                    num = Math.round(num);
                    break;
                case NumberType.REALNUMBERS:
                    num = Math.round(num * 100) / 100;
                    break;
                default:
                    throw new Error("Invalid number type: '" + numberType + "'");
            }
            return num;
        };
        return Helper;
    })();    
    //static generateReverseNormalDistributedRandomNumber(bounds: NumberBounds, numberType: NumberType) {
    //    var dist = new ReverseNormalDistribution({ sigma: 1, mu: -3 }, { sigma: 1, mu: 3 });
    //    bounds.normalize();
    //    var num = dist.sample();
    //    return Helper.adaptNumberToNumberType(num, numberType);
    //}
    //static adaptNumberToNumberType(num: number, numberType: NumberType) {
    //    switch(numberType) {
    //        case NumberType.NATURALNUMBERS:
    //        case NumberType.INTEGERS: return Math.round(num);
    //        case NumberType.REALNUMBERS: return Math.round(num * 100) / 100;
    //        default: throw new Error("Invalid number type: '" + numberType + "'");
    //    }
    //}
    })(Mathematics || (Mathematics = {}));
//@ sourceMappingURL=Mathematics.js.map
