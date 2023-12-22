import React,{useState} from 'react'

const Login = () => {
    const [credentials, setCredentials] = useState({email:"",password:""})
    
    const handlesubmit=async(e)=>{
        e.preventdefault()
        const response = await fetch("http://localhost:5000/api/auth/Login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({email:credentials.email , password:credentials.password}),
          }); 
          const json=await response.json()
          console.log(json)
        };
        const onChange = (e) => {
            setCredentials(...credentials,{[e.target.name]: e.target.value });
            
          };
    
  return (
    <div>
     <form onSubmit={handlesubmit}>
  <div className="mb-3">
    <label htmlFor="email" className="form-label">Email address</label>
    <input type="email" className="form-control" id="email" value={credentials.email}  onChange={onChange} name="email" aria-describedby="emailHelp"/>
    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
  </div>
  <div className="mb-3">
    <label htmlFor="password" className="form-label">Password</label>
    <input type="password" className="form-control" value={credentials.password} onChange={onChange} name="password" id="password"/>
  </div>
  <button type="submit" className="btn btn-primary" >Submit</button>
</form>
    </div>
  )
}

export default Login
