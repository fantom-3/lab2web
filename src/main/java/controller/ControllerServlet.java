package controller;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;


@WebServlet("/controller")
public class ControllerServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        String clearHistoryParam = req.getParameter("clearHistory");
        if ("true".equals(clearHistoryParam)) {
            ServletContext context = getServletContext();
            synchronized (context) {
                context.removeAttribute("history");
            }

        }

        String x = req.getParameter("x");
        String y = req.getParameter("y");
        String r = req.getParameter("r");

        RequestDispatcher dispatcher;

        if (x != null && y != null && r != null) {
            dispatcher = req.getRequestDispatcher("/areaCheck");
        } else {
            dispatcher = req.getRequestDispatcher("/index.jsp");
        }

        dispatcher.forward(req, resp);
    }
}