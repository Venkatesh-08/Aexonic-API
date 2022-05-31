const jwt = require('jsonwebtoken');
const User = require('../model/userModel');
var crypto = require('crypto'); 
const userModel = require('../model/userModel');

exports.register = async (req, res) => {
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var email = req.body.email;
    var password = req.body.password;
    var mobileNo = req.body.mobileNo;
    this.salt = crypto.randomBytes(16).toString('hex'); 
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, `sha512`).toString(`hex`); 

    const user = await User.findOne({"email":email}).exec();

    if(user){
        return res.status(200).json({ status: 400, message: "User already Registered"});
    }
    
    const users = new User({
        firstName: firstName,
        lastName: lastName,
        email: email,
        mobileNo: mobileNo,
        salt:this.salt,
        hash: this.hash
    });

    users.save()
        .then(result => {
            return res.status(200).json({ status: 200, message: "Added Successfully", data: result });
        })
        .catch(err => {
            console.log("Error in Register api:", err);
        });
}

exports.auth = async (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    const user = await User.findOne({"email":email, "password":password}).exec();
    var hash = crypto.pbkdf2Sync(password, user.salt, 1000, 64, `sha512`).toString(`hex`); 

    try{
        if(user){
            if(user.hash == hash){
            let token = jwt.sign({ id: user._id, email: email, password: password }, 'secret');
            const userUpdate = await User.updateOne({_id: user._id},{token: token});
            try{
                return res.status(200).json({ status:200, msg: "Logged in successfully", result: user});
            }
            catch(error){
                res.status(500).send(error);
            }
            }
        }
        else{
            return res.status(200).json({msg: "Bad credentials"});
        }
        }
        catch(error){
            res.status(500).send(error);
        }
}

exports.logout = async (req, res) => {
    var id = req.body.result._id;
    var token = ' ';
    const user = await User.updateOne({_id: id},{token: token});
    try{
        return res.status(200).json({ status:200, msg: "Logged out successfully", result: user});
    }
    catch(error){
        res.status(500).send(error);
    }
}

exports.list = async (req, res) => {
    var pageNo = Number(req.query.start);
    var per_page = Number(req.query.limit);
    var result = await userModel.find({}).skip(pageNo).limit(per_page);
    var count = await userModel.countDocuments();
    return res.status(200).json({ status:200, msg: "User details fetched successfully", result: result, count:count});
}

exports.search = async (req,res) => {
    var pageNo = Number(req.query.start);
    var per_page = Number(req.query.limit);
    var search = req.query.search;
    if(search){
    let data = await userModel.find({
        "$or":[
            {firstName: {$regex: search}},
            {lastName: {$regex: search}},
            {email: {$regex: search}},
            {mobileNo: {$regex: search}}
        ]
    });
    return res.status(200).json({ status:200, msg: "Search details fetched successfully", result: data});
    }
    else{
        var result = await userModel.find({}).skip(pageNo).limit(per_page);
        return res.status(200).json({ status:200, msg: "User details fetched successfully", result: result});
    }
}

exports.listById = async (req,res) => {
    var id = req.query.id;
    let user = await userModel.findById(id);
    try{
        return res.status(200).json({status:200, msg: "User details fetched successfully", result: user});
    }
    catch(error){
        return res.status(500).send(error);
    }

}

exports.updateUser = async (req,res) => {
    var id = req.body._id;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var email = req.body.email;
    var password = req.body.password;
    var mobileNo = req.body.mobileNo;

    let token = jwt.sign({ id: id, email: email, password: password }, 'secret');
    this.salt = crypto.randomBytes(16).toString('hex'); 
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, `sha512`).toString(`hex`); 

    await userModel.findOneAndUpdate({"_id": id}, {"$set": {"firstName": firstName, "lastName": lastName, "email": email, "mobileNo": mobileNo, "token": token, "hash": this.hash, "salt": this.salt}}).exec(function(err,docs){
        if(err) {
            return res.status(500).send(err);
        }
        else{
            return res.status(200).json({status:200, msg:"User updated Successfully!!!", result: docs});
        }
    });
}