import React from 'react';

class Registration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      kPred: '',
      email: '',
      password: '',
      confirmPassword: ''
    };
  }

  handleSubmit = (event) => {
    event.preventDefault();
    // Ваша логика обработки отправки формы
    // Можете использовать значения из состояния this.state
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  render() {
    return (
      <div className="content_container">
        <div className="col-md-4">
          <form id="registerForm" onSubmit={this.handleSubmit}>
            <h2>Create a new account.</h2>
            <hr />
            <div className="form-floating mb-3">
              <input
                type="text"
                name="kPred"
                value={this.state.kPred}
                onChange={this.handleChange}
                className="form-control"
                autoComplete="K_PRED"
                aria-required="true"
                placeholder="K_PRED"
              />
              <label>K_PRED</label>
              {/* Добавьте необходимую валидацию */}
            </div>
            <div className="form-floating mb-3">
              <input
                type="email"
                name="email"
                value={this.state.email}
                onChange={this.handleChange}
                className="form-control"
                autoComplete="username"
                aria-required="true"
                placeholder="name@example.com"
              />
              <label>Email</label>
              {/* Добавьте необходимую валидацию */}
            </div>
            <div className="form-floating mb-3">
              <input
                type="password"
                name="password"
                value={this.state.password}
                onChange={this.handleChange}
                className="form-control"
                autoComplete="new-password"
                aria-required="true"
                placeholder="password"
              />
              <label>Password</label>
              {/* Добавьте необходимую валидацию */}
            </div>
            <div className="form-floating mb-3">
              <input
                type="password"
                name="confirmPassword"
                value={this.state.confirmPassword}
                onChange={this.handleChange}
                className="form-control"
                autoComplete="new-password"
                aria-required="true"
                placeholder="password"
              />
              <label>Confirm Password</label>
              {/* Добавьте необходимую валидацию */}
            </div>
            <button
              id="registerSubmit"
              type="submit"
              className="w-100 btn btn-lg btn-primary"
            >
              Register
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default Registration;