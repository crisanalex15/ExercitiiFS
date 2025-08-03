public class Motociclete
{
    public int Id { get; set; }
    public string Brand { get; set; }
    public string Model { get; set; }
    public string Year { get; set; }
    public string Color { get; set; }
    public string FuelType { get; set; }
    public string Transmission { get; set; }
    public string Mileage { get; set; }
    public string Price { get; set; }
    public int EngineId { get; set; }
    public Engine Engine { get; set; }
}

public class CreateMotocicletaDto
{
    public string Brand { get; set; }
    public string Model { get; set; }
    public string Year { get; set; }
    public string Color { get; set; }
    public string FuelType { get; set; }
    public string Transmission { get; set; }
    public string Mileage { get; set; }
    public string Price { get; set; }

    public int EngineId { get; set; }
}