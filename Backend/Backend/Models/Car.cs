public class Car
{
    public int Id { get; set; }
    public string Model { get; set; }
    public string Brand { get; set; }
    public string Year { get; set; }
    public string Color { get; set; }
    public string FuelType { get; set; }
    public string Transmission { get; set; }
    public string Mileage { get; set; }
    public string Price { get; set; }

    public int EngineId { get; set; }
    public Engine Engine { get; set; }
}

// DTO simplu pentru creare de mașini - doar câmpurile necesare
public class CreateCarDto
{
    public string Model { get; set; }
    public string Brand { get; set; }
    public string Year { get; set; }
    public string Color { get; set; }
    public string FuelType { get; set; }
    public string Transmission { get; set; }
    public string Mileage { get; set; }
    public string Price { get; set; }
    public int EngineId { get; set; } // Doar ID-ul engine-ului!
}
