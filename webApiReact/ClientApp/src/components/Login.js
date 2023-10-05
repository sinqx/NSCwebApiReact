import React from "react";
import axios from "axios";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      rememberMe: false,
    };
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    const { username, password } = this.state;

    try {
      const response = await axios.post("https://localhost:7100/api/User/login", {
        UserName: username,
        Password: password,
      });

      // Успешная аутентификация
      console.log(response.data); // Вывод информации о пользователе в консоль

      // Дополнительная логика после успешной аутентификации
    } catch (error) {
      // Ошибка аутентификации
      console.error(error.response.data);
    }
  };

  handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    const newValue = type === "checkbox" ? checked : value;

    this.setState({ [name]: newValue });
  };

  render() {
    return (
      <div className="content_container">
        <div className="col-md-4">
          <section>
            <form id="account" onSubmit={this.handleSubmit}>
              <h2>Use a local account to log in.</h2>
              <hr />
              {/* Добавьте необходимую валидацию */}
              <div className="form-floating mb-3">
                <input
                  type="username"
                  name="username"
                  value={this.state.username}
                  onChange={this.handleChange}
                  className="form-control"
                  autoComplete="username"
                  aria-required="true"
                  placeholder="username"
                />
                <label>username</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="password"
                  name="password"
                  value={this.state.password}
                  onChange={this.handleChange}
                  className="form-control"
                  autoComplete="current-password"
                  aria-required="true"
                  placeholder="password"
                />
                <label>Password</label>
              </div>
              <div className="checkbox mb-3">
                <label className="form-label">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={this.state.rememberMe}
                    onChange={this.handleChange}
                    className="form-check-input"
                  />
                  Remember Me
                </label>
              </div>
              <div>
                <button
                  id="login-submit"
                  type="submit"
                  className="w-100 btn btn-lg btn-primary"
                >
                  Log in
                </button>
              </div>
              <div>
                <p>
                  <a href="./Register">Или создайте новый аккаунт.</a>
                </p>
              </div>
            </form>
          </section>
        </div>
      </div>
    );
  }
}

export default Login;
