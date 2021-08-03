import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator'

export function IsSameValue(property: string, validationOptions?: ValidationOptions) {
    return function (target: object, propertyName: string) {
        registerDecorator({
            name: "isSameValue",
            target: target.constructor,
            propertyName,
            constraints: [property],
            options: validationOptions,
            validator: {
                validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> | boolean {
                    const relatedValue = (validationArguments?.object as any)[property]
                    return relatedValue === value
                }
            }
        })
    }
}