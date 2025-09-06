import React, { useState, useEffect } from "react";
import 'boxicons/css/boxicons.min.css';
import { useNavigate } from "react-router-dom";
import '../home.css';

interface Task {
  id_task: number;
  title: string;
  description_task: string;
  is_done: boolean;
}

const Home: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');
  const name_user = localStorage.getItem('name_user');
  const navigate = useNavigate();

  if (!token) {
    return <div>Por favor, faça login para acessar esta página.</div>;
  }

  // Carregar tasks do usuário logado
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch('http://localhost:3000/tasks', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok && data.Tasks) setTasks(data.Tasks);
      } catch (err) {
        console.log("Erro ao carregar tarefas", err);
      }
    };
    fetchTasks();
  }, [token]);

  // Criar nova task
  const handleCreateTask = async () => {
    if (!title || !description) {
      setError("Preencha todos os campos!");
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, description_task: description })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Erro ao criar tarefa");
        return;
      }

      setTasks([...tasks, data.data]);
      setTitle('');
      setDescription('');
      setShowModal(false);
      setError('');
    } catch (err) {
      setError("Erro ao criar tarefa. Tente novamente.");
    }
  };

  // Alternar status da task
  const toggleTaskStatus = async (taskId: number, isDone: boolean) => {
    try {
      const res = await fetch(`http://localhost:3000/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ is_done: !isDone })
      });

      const data = await res.json();

      if (!res.ok) {
        console.log(data.message || "Erro ao atualizar task");
        return;
      }

      setTasks(tasks.map(task =>
        task.id_task === taskId ? { ...task, is_done: !isDone } : task
      ));
    } catch (err) {
      console.log("Erro ao atualizar task", err);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
  const confirmDelete = window.confirm("Tem certeza que deseja deletar esta tarefa?");
  if (!confirmDelete) return;

  try {
    const res = await fetch(`http://localhost:3000/tasks/${taskId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!res.ok) {
      const data = await res.json();
      console.log(data.message || "Erro ao deletar tarefa");
      return;
    }

    setTasks(tasks.filter(task => task.id_task !== taskId));
  } catch (err) {
    console.log("Erro ao deletar tarefa", err);
  }
};

  // Logout
  const handleLogout = () => {
    const confirmLogout = window.confirm('Tem certeza que deseja encerrar a sessão?');
    if (confirmLogout) {
      localStorage.removeItem('token');
      localStorage.removeItem('name_user');
      localStorage.removeItem('id_user');
      navigate('/');
    }
  };

  return (
    <div className="home-page">
      <div className="side-bar">
        <div className="profile">
          <i className='bx bxs-user'></i>
          <span>Olá, {name_user || 'Usuário'}!</span>
        </div>
        <div className="logout">
          <button onClick={handleLogout}><i className='bx bx-log-out'></i> Encerrar sessão</button>
        </div>
      </div>

      <div className="todolist">
        <h2>Tarefas do {name_user || 'Usuário'}</h2>
        <div className="create-task">
          <button onClick={() => setShowModal(true)}>
            <i className='bx bx-plus'></i> Adicionar Tarefa
          </button>
        </div>

        {/* Modal de criação */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Nova Tarefa</h3>
              <input
                type="text"
                placeholder="Título"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <textarea
                placeholder="Descrição"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              {error && <p className="error">{error}</p>}
              <div className="modal-buttons">
                <button className="btn-create" onClick={handleCreateTask}>Criar</button>
                <button className="btn-cancel" onClick={() => setShowModal(false)}>Cancelar</button>
              </div>
            </div>
          </div>
        )}

        {/* Lista de tarefas */}
        <div className="task-list">
          {tasks.map((task) => (
            <div key={task.id_task} className="task-item">
              <h3>{task.title}</h3>
              <p>{task.description_task}</p>
              <span className={`task-status ${task.is_done ? 'done' : 'pending'}`}>
  {task.is_done ? "Concluída" : "Pendente"}
</span>

              <div className="task-actions">
                <button onClick={() => toggleTaskStatus(task.id_task, task.is_done)}>
                  {task.is_done ? 'Marcar como pendente' : 'Marcar como concluída'}
                </button>

                <button className="btn-delete" onClick={() => handleDeleteTask(task.id_task)}>
      Deletar
    </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
