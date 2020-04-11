const express = require('express')
const app = express()
const {uuid, isUuid} = require('uuidv4') 

// middlewares

function logRequest(req, res, next) { //middleware
    const { method, url } = req

    const logLabel = `[${method.toUpperCase()}] ${url}`

    console.log(logLabel)

    return next()
}

function validadeProjectId(req, res, next) { //midleware
    const {id} = req.params

    if (!isUuid(id)) {
        return res.status(400).json({error: "invalid project ID"})
    }

    return next()
}


//aplicacao dos middlewares

app.use(express.json())
app.use(logRequest) //aplicado de forma global
app.use('/projects/:id', validadeProjectId ) //aplicado somente em rotas que apresentam esse path




const projects = []

// Routes

app.get('/projects', (req, res) => {
    const { title } = req.query

    const results = title
    ? projects.filter(project => project.title.includes(title))
    : projects

    return res.json(results)
})

app.post('/projects', (req, res) => {
    const {title, owner} = req.body

    const project = { id:uuid(), title, owner}

    projects.push(project)

    return res.json(project)
})


app.put('/projects/:id', (req, res) => {
    const {id} = req.params
    const {title, owner} = req.body

    const projectIndex = projects.findIndex(project => project.id === id)

    if (projectIndex < 0) {
        return res.status(400).json({ error: 'Project not found.'})
    }
    
    const project ={
        id,
        title,
        owner,
    }

    projects[projectIndex] = project // vai trocar o objeto inteiro

    return res.json(project)
})


app.delete('/projects/:id', (req,res) => {
    const {id} = req.params

    const projectIndex = projects.findIndex(project => project.id === id)

    if (projectIndex < 0) {
        return res.status(400).json({ error: 'Project not found.'})
    }

    projects.splice(projectIndex, 1)
    return res.status(204).send()
})


app.listen(3333, () => {
    console.log('foi')
})