import React from 'react';
import PropTypes from 'prop-types';

export default class FormValidator extends React.Component {
  static propTypes = {
    initialValues: PropTypes.object,
    validate: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    children: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      values: this.props.initialValues,
      errors: {},
      touched: false,
      isValid: false,
      isValidating: false,
      isSubmitting: false
    };

    this.validateForm = this.validateForm.bind(this);
    this.onChange = this.onChange.bind(this);

    this.isUnmounted = false;
  }

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  async validateForm(submit = false) {
    if (this.state.isSubmitting) {
      return;
    }

    this.setState({
      isValidating: true
    });

    let errors = await this.props.validate(this.state.values);
    let isValid = !Object.keys(errors).find(key => !!errors[key]);

    await new Promise(resolve =>
      this.setState(
        {
          touched: true,
          errors,
          isValid,
          isValidating: false,
          isSubmitting: isValid && submit
        },
        resolve
      )
    );

    if (this.state.isSubmitting) {
      await this.props.onSubmit(this.state.values);

      // This is a quick-fix to prevent state updates when redirecting
      if (!this.isUnmounted) {
        this.setState({
          isSubmitting: false
        });
      }
    }
  }

  onChange(name) {
    return value => {
      if (this.state.isSubmitting) {
        return;
      }

      this.setState(
        {
          values: {
            ...this.state.values,
            [name]: value
          }
        },
        () => {
          if (this.state.touched) {
            this.validateForm();
          }
        }
      );
    };
  }

  render() {
    let { children } = this.props;

    return children({
      values: this.state.values,
      errors: this.state.errors,
      touched: this.state.touched,
      onChange: this.onChange,
      validateForm: this.validateForm,
      isValid: this.state.isValid,
      isValidating: this.state.isValidating,
      isSubmitting: this.state.isSubmitting
    });
  }
}
