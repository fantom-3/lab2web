<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Результат проверки точки</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>

<header>
  <h1>Результат проверки точки</h1>
</header>

<main>
  <section>
    <h2>Текущий результат</h2>

    <%
      Double x = (Double) request.getAttribute("x");
      Double y = (Double) request.getAttribute("y");
      Double r = (Double) request.getAttribute("r");
      Boolean hit = (Boolean) request.getAttribute("hit");
      String currentTime = (String) request.getAttribute("currentTime");
      Long execTimeNs = (Long) request.getAttribute("execTimeNs");

      String hitText;
      if (hit != null && hit) {
        hitText = "Попадание в область";
      } else {
        hitText = "Точка вне области";
      }
    %>

    <p>
      Точка (
      <strong><%= x %></strong>;
      <strong><%= y %></strong>
      ) при R = <strong><%= r %></strong>:
      <strong><%= hitText %></strong>
    </p>

    <table>
      <tr>
        <th>Параметр</th>
        <th>Значение</th>
      </tr>
      <tr>
        <td>X</td>
        <td><%= x %></td>
      </tr>
      <tr>
        <td>Y</td>
        <td><%= y %></td>
      </tr>
      <tr>
        <td>R</td>
        <td><%= r %></td>
      </tr>
      <tr>
        <td>Результат</td>
        <td><%= hitText %></td>
      </tr>
      <tr>
        <td>Время проверки</td>
        <td><%= currentTime %></td>
      </tr>
      <tr>
        <td>Время выполнения (нс)</td>
        <td><%= execTimeNs %></td>
      </tr>
    </table>
  </section>

  <section>
    <h2>Возврат на главную страницу</h2>
    <a href="controller">Назад к форме</a>
  </section>
</main>

</body>
</html>