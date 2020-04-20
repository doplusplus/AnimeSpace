from django.shortcuts import render
from django.contrib.auth import authenticate
from django.http import HttpResponse

import json



def log_in(request):
    data =json.loads(request.body.decode("utf-8"))
    user = authenticate(username=data['login'], password=data['password'])
    valid = user is not None 
    response = {"valiUser" : valid}
    return HttpResponse(json.dumps(response), content_type='application/json')
    