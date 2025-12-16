<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="java.util.List" %>
<%@ page import="model.HitResult" %>
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>ЛР2 — проверка попадания точки</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>

<header>
  <h1>Керимов Артём Тимурович — Группа: P3222 — Вариант N59523</h1>
</header>

<main>
  <section>
    <h2>Ввод координат точки</h2>

    <form id="point-form" method="get" action="controller">

      <fieldset>
        <legend>Координата X</legend>

        <label><input type="radio" name="x" value="-3"> -3</label>
        <label><input type="radio" name="x" value="-2"> -2</label>
        <label><input type="radio" name="x" value="-1"> -1</label>
        <label><input type="radio" name="x" value="0"> 0</label>
        <label><input type="radio" name="x" value="1"> 1</label>
        <label><input type="radio" name="x" value="2"> 2</label>
        <label><input type="radio" name="x" value="3"> 3</label>
        <label><input type="radio" name="x" value="4"> 4</label>
        <label><input type="radio" name="x" value="5"> 5</label>
      </fieldset>

      <fieldset>
        <legend>Координата Y</legend>
        <label>
          Y:
          <input type="text" name="y" id="y-input" placeholder="-3 ... 5" autocomplete="off">
        </label>
      </fieldset>

      <fieldset>
        <legend>Радиус R</legend>

        <label><input type="radio" name="r" value="1"> 1</label>
        <label><input type="radio" name="r" value="1.5"> 1.5</label>
        <label><input type="radio" name="r" value="2"> 2</label>
        <label><input type="radio" name="r" value="2.5"> 2.5</label>
        <label><input type="radio" name="r" value="3"> 3</label>
      </fieldset>

      <div id="error-message" style="color: red;"></div>

      <div style="margin-top: 10px;">
        <button type="submit">Проверить</button>
        <button type="reset">Сбросить форму</button>
      </div>
    </form>
  </section>

  <section>
    <h2>График и результаты</h2>

    <div id="graph-container" style="margin: 10px 0;">
      <canvas id="area-canvas" width="300" height="300"
              style="border: 1px solid #000;">
        Ваш браузер не поддерживает canvas.
      </canvas>
    </div>

    <form method="get" action="controller" style="margin-top: 10px;">
      <input type="hidden" name="clearHistory" value="true">
      <button type="submit">Очистить историю</button>
    </form>

    <hr style="margin: 15px 0;">

    <h3>История проверок</h3>

    <%
      List<HitResult> history = (List<HitResult>) application.getAttribute("history");
    %>

    <%
      if (history == null || history.isEmpty()) {
    %>
    <p>История пока пуста.</p>
    <%
    } else {
    %>
    <table id="history-table">
      <tr>
        <th>X</th>
        <th>Y</th>
        <th>R</th>
        <th>Попадание</th>
        <th>Время проверки</th>
        <th>Время выполнения (нс)</th>
      </tr>
      <%
        for (HitResult h : history) {
      %>
      <tr>
        <td><%= h.getX() %></td>
        <td><%= h.getY() %></td>
        <td><%= h.getR() %></td>
        <td><%= h.isHit() ? "Да" : "Нет" %></td>
        <td><%= h.getCurrentTime() %></td>
        <td><%= h.getExecTimeNs() %></td>
      </tr>
      <%
        }
      %>
    </table>
    <%
      }
    %>
  </section>
</main>

<script src="js/script.js"></script>

</body>
</html>