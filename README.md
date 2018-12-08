# Simple React Form Validator

Simple React Form Validator is a small simple helper wrapper around forms that makes managing validation state a bliss without giving up on readability and full control.

A quick example of how it works. Detailed docs will follow asap.

```Js
import FormValidator from 'simple-react-form-validator';

export default function Form(props) {
  return (
    <FormValidator
      initialValues={{
        email: 'john@doe.com'
      }}
      onSubmit={async values => {
        // Submit the values

      }}
      validate={async values => {
        // Do some validation here
        if (values.email !== 'john@doe.com') {
          return {
            email: 'incorrect email address.'
          };
        }
      }}
    >
      {
        ({ values, errors, touched, onChange, validateForm, isValidating, isSubmitting }) => {
          return (
            <form
              onSubmit={evt => {
                evt.preventDefault();
                validateForm(true);
              }}
            >
              <label htmlFor="email"></label>
              <input type="email" onChange={(evt) => {
                onChange('email')(evt.target.value)
              }} value={values['email']} placeholder="john@doe.com" id="email" />

              {touched && errors['email'] && <p className="error">{errors['email']}</p>}

              <button type="submit">Submit!</button>
            </form>
          );
        }
      }
    </FormValidator>
  );
}
```
