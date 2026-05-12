function calculateResult()
{
    let m1 = Number(document.getElementById('m1').value);

    let m2 = Number(document.getElementById('m2').value);

    let m3 = Number(document.getElementById('m3').value);

    let m4 = Number(document.getElementById('m4').value);

    let m5 = Number(document.getElementById('m5').value);

    let m6 = Number(document.getElementById('m6').value);

    let m7 = Number(document.getElementById('m7').value);

    let m8 = Number(document.getElementById('m8').value);

    let total =
    m1 + m2 + m3 + m4 + m5 + m6 + m7 + m8;

    document.getElementById("total").innerHTML =
    "Total Marks = " + total;

    if(total > 700)
    {
        document.getElementById("result").innerHTML =
        "Distinction";

        document.getElementById("result").style.color =
        "green";
    }

    else if(total > 600)
    {
        document.getElementById("result").innerHTML =
        "First Division";
    }

    else if(total >= 500)
    {
        document.getElementById("result").innerHTML =
        "Second Division";
    }

    else if(total >= 400)
    {
        document.getElementById("result").innerHTML =
        "Third Division";
    }

    else
    {
        document.getElementById("result").innerHTML =
        "Fail";

        document.getElementById("result").style.color =
        "red";
    }
}