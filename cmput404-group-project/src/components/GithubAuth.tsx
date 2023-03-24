
import LoginGithub from 'react-login-github';

export default function GithubAuth() {
  function onSuccess(e) {

    fetch("http://127.0.0.1:8000/service/github/", {
      method: "POST",
      body: JSON.stringify({ "auth_token": e.code }),
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
      .then((res) => res.json())
      .then((response) => {
        console.log(response);
        document.getElementById("email_id").innerText = response['email']
        document.getElementById("auth_token").innerText = response['tokens']
      })

  }
  function onFailure(e) {
    alert(e)
  }
  return (
    <div className="App">
      <LoginGithub
        clientId="4c8d1c62b3dc5e785144"
        onSuccess={onSuccess}
        onFailure={onFailure}

        className="github">
        <h2 className='github-name'>Sign in with github</h2>

      </LoginGithub>
      <div className="show-user_info">
        <div >
          <label className="info">Email Id:</label>
          <label id='email_id'></label>
        </div>
        <div >
          <label className="info">Auth token:</label>
          <label id="auth_token"></label>
        </div>
      </div>
    </div>
  );
}
