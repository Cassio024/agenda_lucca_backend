// --- ROTAS DE UTILIZADOR ---
app.post('/api/users/register', async (req, res) => {
  try {
    const { name, email, password, birthDate } = req.body; // birthDate é "4/7/2002"

    // --- INÍCIO DA CORREÇÃO ---
    // 1. Vamos dividir a string "4/7/2002" em partes: ["4", "7", "2002"]
    const parts = birthDate.split('/');
    // 2. Agora, criamos um objeto Date.
    //    Atenção: O formato é new Date(ano, mês_indexado_em_zero, dia)
    const dateObject = new Date(parts[2], parts[1] - 1, parts[0]);
    // --- FIM DA CORREÇÃO ---

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email já está em uso.' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // 3. Usamos o 'dateObject' corrigido aqui
    const newUser = new User({ name, email, password: hashedPassword, birthDate: dateObject }); 
    await newUser.save();

    res.status(201).json({ message: 'Utilizador criado com sucesso!' });
  } catch (error) {
    // Adicione este console.log para ver o erro no Render se algo mais falhar
    console.error('ERRO NO REGISTRO:', error); 
    res.status(500).json({ message: 'Erro no servidor', error: error.message });
  }
});