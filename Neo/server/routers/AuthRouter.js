const express=require("express")
const router=express.Router()
const {AuthRegister, AuthLogin}=require("../controllers/AuthController")

router.post("/login",AuthLogin)
router.post("/register",AuthRegister)


module.exports =router
