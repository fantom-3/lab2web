package area;

import model.HitResult;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;


@WebServlet("/areaCheck")
public class AreaCheckServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        long startTime = System.nanoTime();

        String xParam = req.getParameter("x");
        String yParam = req.getParameter("y");
        String rParam = req.getParameter("r");

        double x = parseDouble(xParam);
        double y = parseDouble(yParam);
        double r = parseDouble(rParam);

        boolean hit = checkHit(x, y, r);

        long execTimeNs = System.nanoTime() - startTime;
        String currentTime = LocalDateTime.now()
                .format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));

        HitResult result = new HitResult(x, y, r, hit, currentTime, execTimeNs);

        ServletContext context = getServletContext();
        List<HitResult> history;

        synchronized (context) {
            history = (List<HitResult>) context.getAttribute("history");
            if (history == null) {
                history = new ArrayList<>();
            }
            history.add(result);

            context.setAttribute("history", history);
        }

        req.setAttribute("x", x);
        req.setAttribute("y", y);
        req.setAttribute("r", r);
        req.setAttribute("hit", hit);
        req.setAttribute("currentTime", currentTime);
        req.setAttribute("execTimeNs", execTimeNs);

        req.getRequestDispatcher("/result.jsp").forward(req, resp);
    }

    private double parseDouble(String value) {
        if (value == null) {
            throw new IllegalArgumentException("Параметр не задан");
        }
        value = value.trim().replace(',', '.');
        return Double.parseDouble(value);
    }


    private boolean checkHit(double x, double y, double r) {
        // круг
        if (x <= 0 && y >= 0 && x * x + y * y <= r * r) {
            return true;
        }

        // Прямоугольник
        if (x >= 0 && y >= 0 && x <= r / 2.0 && y <= r) {
            return true;
        }

        // Треугольник
        if (x <= 0 && y <= 0 && y >= -(x + r) / 2.0) {
            return true;
        }

        return false;
    }
}