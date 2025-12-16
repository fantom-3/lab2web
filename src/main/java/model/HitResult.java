package model;


public class HitResult {

    private final double x;
    private final double y;
    private final double r;
    private final boolean hit;
    private final String currentTime;
    private final long execTimeNs;


    public HitResult(double x, double y, double r,
                     boolean hit,
                     String currentTime,
                     long execTimeNs) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.hit = hit;
        this.currentTime = currentTime;
        this.execTimeNs = execTimeNs;
    }


    public double getX() {
        return x;
    }

    public double getY() {
        return y;
    }

    public double getR() {
        return r;
    }

    public boolean isHit() {
        return hit;
    }


    public String getCurrentTime() {
        return currentTime;
    }


    public long getExecTimeNs() {
        return execTimeNs;
    }
}