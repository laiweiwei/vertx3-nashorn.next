package com.jetdrone.nashorn.next;

import io.vertx.core.Vertx;
import io.vertx.core.json.JsonObject;

import javax.script.ScriptException;

final class DummyLoader extends Loader {

  DummyLoader(Vertx vertx) throws ScriptException, NoSuchMethodException {
    super(vertx);
  }

  @Override
  public void config(JsonObject config) throws ScriptException {
    throw new ScriptException("not supported!");
  }

  @Override
  public void main(String main) throws ScriptException {
    throw new ScriptException("not supported!");
  }
}
