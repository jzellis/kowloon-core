import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css';
import axios from 'axios';
import cookieCutter from 'cookie-cutter';
import Router from 'next/router';
export default function Init() { 
    
    const submitForm = async (e) => {
        e.preventDefault();
        const formData = {
            username: e.target.username.value,
            email: e.target.email.value,
            password: e.target.password.value,
            displayName: e.target.displayName.value,
        };

          const response = await axios.post('/api/my/me', formData);
      
        //   console.log('response', response.data);

        if (response.data.token) {
            cookieCutter.set('token', response.data.token);
            Router.push('/my/')

        }

    }

    return (
        <div className={styles.container}>
          <Head>
            <title>Kowloon | Init</title>
            <meta name="description" content="Generated by create next app" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
    
          <main className={styles.main}>
                <form id="createUser" onSubmit={submitForm}>
                    <h1>Create User</h1>
                    <fieldset>
                    <label htmlFor='username'>Username</label>
                    <input name='username' id='username' placeholder="Username" />
                    </fieldset>
                    <br />                
                    <fieldset>
                        <label htmlFor='email'>Email</label>
                    <input type='email' name='email' id='email' placeholder="Email" />
                    </fieldset>
                    <br />      
                    <fieldset>
                        <label htmlFor="password">Password</label>
                        <input type='password' name='password' id='password' placeholder="Password" />
                        </fieldset>
                    <br />        
                    <fieldset>
                        <label htmlFor="displayname">Display Name</label>
                        <input name='displayName' id='displayName' placeholder="Display Name, i.e. &quot;Bob Smith&quot;" />
                        </fieldset>
                    <br />                
                    <button type='submit'>Create User</button>
                </form>
          </main>
    
        </div>
      )

}