module.exports = function(app, db, MethPass, isAuthenticated) {

    var createPass = function(req, res) {
        var myMethPass = new MethPass();
        myMethPass.Customer = req.body.Customer;
        myMethPass.PaidDate = Date.now();
        myMethPass.DaysPaid = req.body.DaysPaid;
        myMethPass.Seller = req.body.Seller;
        myMethPass.Note = req.body.Note;
        myMethPass.Blacklisted = false;

        res.status(200);
        res.send(myMethPass);

        myMethPass.save();
    }

    var updatePass = function(req, res) {
        MethPass.findOne({
            _id: req.body._id
        }, function(err, methPass) {
            if (methPass === undefined || methPass === null) {
                res.status(400).send("methPass does not exist");
            } else {
                methPass.Customer = req.body.Customer;
                methPass.PaidDate = req.body.PaidDate;
                methPass.DaysPaid = req.body.DaysPaid;
                methPass.Seller = req.body.Seller;
                methPass.Note = req.body.Note;
                methPass.Blacklisted = req.body.Blacklisted;

                res.status(200);
                res.send("Updated");
                methPass.save();
            }
        });
    }

    var removePass = function(req, res) {
        MethPass.findOne({
            _id: req.body._id
        }, function(err, methPass) {
            if (methPass === undefined || methPass === null) {
                res.status(400).send("methPass does not exist");
            } else {
                methPass.remove();
                methPass.save();
                res.status(200);
                res.send("Deleted!");
            }
        });
    }

    function findObject(obj, list) {
        var i;
        for (i = 0; i < list.length; i++) {
            if (list[i].Name == obj) {
                return list[i];
            }
        }
        return null;
    }

    var getAllPasses = function(req, res) {
        MethPass.find({}, function(err, methPasses) {
            var passMap = {};
            var activePasses = [];
            var expiredPasses = [];
            var blacklistedPasses = [];
            var topSellers = [];
            var totalMoney = 0;

            methPasses.forEach(function(pass) {
                passMap[pass._id] = pass;

                var expirationDate = new Date(pass.PaidDate);
                expirationDate.setDate(expirationDate.getDate() + pass.DaysPaid);

                var diff = expirationDate.valueOf() - Date.now().valueOf();
                var diffInHours = diff/1000/60/60; // Convert milliseconds to hours
                pass.HoursLeft = Math.round(diffInHours * 10) / 10;

                if (pass.Blacklisted == false) {
                    if (pass.HoursLeft > 0) {
                        activePasses.push(pass);
                    } else if (pass.HoursLeft <= 0) {
                        expiredPasses.push(pass);
                    }

                    var money = 0;
                    for (var i = 0; i < pass.DaysPaid; i++) {
                        if (pass.DaysPaid < 7) {
                            money += 0; // Insert cost here
                        } else if (pass.DaysPaid <= 30) {
                            money += 0; // Insert cost here
                        }
                    };
                    totalMoney += money;

                    var myPass = findObject(pass.Seller, topSellers);
                    if (myPass != null) {
                        myPass.Amount += money;
                    } else {
                        var seller = {Name: pass.Seller, Amount: money}
                        topSellers.push(seller);
                    }


                    var seller = pass.Seller;
                    if (topSellers[seller] == null) {
                        topSellers[seller] = money;
                    } else {
                        topSellers[seller] += money
                    }
                    
                } else {
                    blacklistedPasses.push(pass);
                }

            });

            var data = {ActivePasses: activePasses, ExpiredPasses: expiredPasses,
                BlacklistedPasses: blacklistedPasses, Money: totalMoney, TopSellers: topSellers};

            res.send(data);
        });
    }

    app.post("/api/pass", isAuthenticated, function(req, res) {
        createPass(req, res);
    });

    app.put("/api/pass", isAuthenticated, function(req, res) {
        updatePass(req, res);
    });

    app.put("/api/pass/delete", isAuthenticated, function(req, res) {
        removePass(req, res);
    });

    app.get("/api/pass", isAuthenticated, function(req, res) {
        getAllPasses(req, res);
    })
};