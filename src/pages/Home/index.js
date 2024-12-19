import { useState } from 'react';
import { Header } from '../../components/Header';
import background from '../../assets/background.png';
import ItemList from '../../components/ItemList';
import './styles.css';

function App() {
  const [user, setUser] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [repos, setRepos] = useState([]);

  const handleGetData = async () => {
    
    const userDataResponse = await fetch(`https://api.github.com/users/${user}`);
    const newUser = await userDataResponse.json();

    if (newUser.name) {
      const { avatar_url, name, bio } = newUser;
      setCurrentUser({ avatar_url, name, bio });

      const reposDataResponse = await fetch(`https://api.github.com/users/${user}/repos`);
      const newRepos = await reposDataResponse.json();

      if (newRepos.length) {
        setRepos(newRepos);
      } else {
        setRepos([]); // Se não houver repositórios, limpar o estado
      }
    } else {
      // Limpar dados se o usuário não for encontrado
      setCurrentUser(null);
      setRepos([]);
    }
  };

  return (
    <div className="App">
      <Header />
      <div className="conteudo">
        <img src={background} className="background" alt="background app" />
        <div className="info">
          <div>
            <input
              name="usuario"
              value={user}
              onChange={(event) => setUser(event.target.value)}
              placeholder="@username"

            />
            <button onClick={handleGetData}>Buscar</button>
          </div>

          {currentUser?.name && (
            <>
              <div className="perfil">
                <img
                  src={currentUser.avatar_url}
                  className="profile"
                  alt={`Foto de perfil de ${currentUser.name}`}
                />
                <div>
                  <h3>{currentUser.name}</h3>
                  <span>@{user}</span>
                  <p>{currentUser.bio}</p>
                </div>
              </div>
              <hr />
            </>
          )}

          <div>
            <h4 className="repositorio">Repositórios</h4>
            {repos.length > 0 ? (
              repos.map((repo) => (
                <ItemList
                  key={repo.id}
                  title={repo.name}
                  description={repo.description || 'Sem descrição disponível'}
                />
              ))
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
