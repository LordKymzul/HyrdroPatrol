def individual_average_pressure(average) -> dict:
    return {
        "location": average['location'],
        "pressure": average['pressure']
    }


def list_average_pressure(averages) -> list:
    return [individual_average_pressure(average) for average in averages]
